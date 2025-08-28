# Changelog

## Fix: Reliable SKU-based draft order mapping

- Fixed draft order quantity misalignment by switching from index-based pairing to SKU-based row mapping with validation.
- Unresolvable SKUs now fail fast with a clear error; no silent misalignment.
- Removed temporary debug logs; preserved validation and error handling.
- Note: If a SKU changed in Shopify but not in HubSpot, the app will surface an error. Recommend adding an n8n “product update → HubSpot” sync.
