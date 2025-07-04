import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; dealId: string }>;
};

const ContactsPage = async ({ params }: Props) => {
  const Overview = "/";

  redirect(Overview);
};

export default ContactsPage;
