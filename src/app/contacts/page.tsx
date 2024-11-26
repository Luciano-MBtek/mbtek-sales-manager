import { SearchContactTab } from "@/components/Search-contact-tab";
import { SingleProductContextProvider } from "@/contexts/singleProductContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Search contacts in hubspot.",
};

const Contacts = () => {
  return (
    <div className="flex w-full justify-center mt-10 ">
      <SingleProductContextProvider>
        <SearchContactTab />
      </SingleProductContextProvider>
    </div>
  );
};

export default Contacts;
