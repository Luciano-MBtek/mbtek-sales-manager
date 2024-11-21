import { SearchContactTab } from "@/components/Search-contact-tab";
import { SingleProductContextProvider } from "@/contexts/singleProductContext";

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
