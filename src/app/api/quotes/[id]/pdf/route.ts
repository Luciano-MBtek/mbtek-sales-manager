import { NextRequest } from "next/server";
import { getQuoteFullDetail } from "@/actions/quote/getQuoteFullDetail";
import { launchChromium } from "@/lib/pdf/chromium";

const PAGE_SIZE = process.env.PDF_PAGE_SIZE || "letter";
const TIMEOUT_MS = Number(process.env.PDF_TIMEOUT_MS || 20000);
const ALLOW_FALLBACK = (process.env.PDF_ALLOW_FALLBACK || "true").toLowerCase() === "true";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const quoteId = params.id;
  if (!quoteId) {
    return new Response(JSON.stringify({ error: "Missing quote id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  let browser: any;
  try {
    const quote = await getQuoteFullDetail(quoteId);
    if (!quote) {
      return new Response(JSON.stringify({ error: "Quote not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    const htmlUrl: string | undefined = quote.properties?.hs_quote_link;
    const hubspotPdfUrl: string | undefined = quote.properties?.hs_pdf_download_link;

    // Try to fetch HTML of the view first
    let html: string | null = null;
    let htmlFetchStatus: number | undefined;
    if (htmlUrl) {
      try {
        const htmlRes = await fetch(htmlUrl, { method: "GET", next: { revalidate: 0 } });
        htmlFetchStatus = htmlRes.status;
        if (htmlRes.ok) {
          html = await htmlRes.text();
        }
      } catch (err) {
        // swallow; we may fallback
      }
    }

    // If HTML unavailable and fallback allowed, proxy HubSpot PDF
    if (!html && hubspotPdfUrl && ALLOW_FALLBACK) {
      try {
        const upstream = await fetch(hubspotPdfUrl, { method: "GET" });
        if (!upstream.ok) {
          return new Response(JSON.stringify({ error: "Unable to fetch HubSpot PDF" }), {
            status: upstream.status,
            headers: { "content-type": "application/json" },
          });
        }
        const blob = await upstream.arrayBuffer();
        return new Response(Buffer.from(blob), {
          status: 200,
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `attachment; filename="quote-${quoteId}.pdf"`,
            "x-pdf-fallback": "hubspot",
            "x-upstream-status": String(upstream.status),
            "cache-control": "no-store",
          },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: "Unable to generate PDF" }), {
          status: 422,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // We have HTML: render via Chromium
    if (!html) {
      return new Response(JSON.stringify({ error: "Unable to fetch quote HTML" }), {
        status: 422,
        headers: { "content-type": "application/json" },
      });
    }

    // Rewrite relative asset URLs to absolute based on htmlUrl origin
    try {
      if (htmlUrl) {
        const u = new URL(htmlUrl);
        html = html.replace(/(src|href)=("|')\/(?!\/)/g, `$1=$2${u.origin}/`);
      }
    } catch {}

    // Inject minimal print CSS if not present
    if (!html.includes("__pdf_print_reset")) {
      const pageSizeVar = (process.env.PDF_PAGE_SIZE || PAGE_SIZE).toLowerCase();
      const printCss = `\n<style id="__pdf_print_reset">\n@page { size: var(--pdf-page-size, ${pageSizeVar}); margin: 0; }\n@media print {\n  html, body { background: #fff !important; }\n  .pdf-container, .page, .sheet { box-shadow: none !important; border: 0 !important; }\n  .preview-chrome, .page-shadow { display: none !important; }\n}\n</style>\n`;
      html = html.replace(/<head(\s[^>]*)?>/i, (m) => `${m}${printCss}`);
    }

    browser = await launchChromium();
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setContent(html, { waitUntil: "networkidle0", timeout: TIMEOUT_MS });

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await page.close();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename=\"quote-${quoteId}.pdf\"`,
        "cache-control": "no-store",
        "x-pdf-fallback": "false",
        "x-page-size": PAGE_SIZE,
        "x-print-background": "true",
        "x-header-footer": "false",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Unable to generate PDF" }), {
      status: 422,
      headers: { "content-type": "application/json" },
    });
  } finally {
    try {
      if (browser) await browser.close();
    } catch {}
  }
}


