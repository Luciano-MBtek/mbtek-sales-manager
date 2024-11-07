"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  singleProductInitialValuesType,
  newSingleProductType,
  singleProductInitialValuesSchema,
} from "@/schemas/singleProductSchema";

const defaultSingleProduct: singleProductInitialValuesType = {
  name: "",
  lastname: "",
  email: "",
  address: "",
  country: "",
  state: "",
  province: "",
  city: "",
  zip: "",
  products: [],
  splitPayment: "",
};

const LOCAL_STORAGE_KEY = "multi-page-form-single-product";

type SingleProductContextType = {
  singleProductData: singleProductInitialValuesType;
  updateSingleProductDetails: (
    leadDetails: Partial<newSingleProductType>
  ) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
};

export const SingleProductContext =
  createContext<SingleProductContextType | null>(null);

export const SingleProductContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [singleProductData, setsingleProductData] =
    useState<singleProductInitialValuesType>(defaultSingleProduct);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(singleProductData);
    }
  }, [singleProductData, dataLoaded]);

  const updateSingleProductDetails = useCallback(
    (productDetails: Partial<newSingleProductType>) => {
      setsingleProductData({ ...singleProductData, ...productDetails });
    },
    [singleProductData]
  );

  const saveDataToLocalStorage = (
    currentDealData: singleProductInitialValuesType
  ) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
  };

  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setsingleProductData(defaultSingleProduct);
    const validated = singleProductInitialValuesSchema.safeParse(
      JSON.parse(loadedDataString)
    );

    if (validated.success) {
      setsingleProductData(validated.data);
    } else {
      console.error("Validation failed:", validated.error);
      setsingleProductData(defaultSingleProduct);
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setsingleProductData(defaultSingleProduct);
  };

  const contextValue = useMemo(
    () => ({
      singleProductData,
      dataLoaded,
      updateSingleProductDetails,
      resetLocalStorage,
    }),
    [singleProductData, dataLoaded, updateSingleProductDetails]
  );

  return (
    <SingleProductContext.Provider value={contextValue}>
      {children}
    </SingleProductContext.Provider>
  );
};

export function useSingleProductContext() {
  const context = useContext(SingleProductContext);
  if (!context) {
    throw new Error(
      "useSingleProductContext must be used within a SingleProductContextProvider"
    );
  }
  return context;
}
