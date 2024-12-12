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
  newLeadInitialValuesType,
  newLeadType,
  newLeadInitialValuesSchema,
} from "@/schemas/newLeadSchema";

const defaultDeal: newLeadInitialValuesType = {
  name: "",
  lastname: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  province: "",
  leadType: "",
  projectSummary: "",
  reasonForCalling: "",
  wantCompleteSystem: "",
  allocatedBudget: "",
  stepsForDecision: "",
  leadBuyingIntention: "",
  expectedETA: "",
  decisionMaker: "",
  goodFitForLead: "",
  moneyAvailability: "",
  estimatedTimeForBuying: "",
};

const LOCAL_STORAGE_KEY = "multi-page-form-demo-newLeadData";

type AddLeadContextType = {
  newLeadData: newLeadInitialValuesType;
  updateNewLeadDetails: (leadDetails: Partial<newLeadType>) => void;
  dataLoaded: boolean;
  resetLocalStorage: () => void;
};

export const AddLeadContext = createContext<AddLeadContextType | null>(null);

export const AddLeadContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [newLeadData, setnewLeadData] =
    useState<newLeadInitialValuesType>(defaultDeal);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    readFromLocalStorage();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      saveDataToLocalStorage(newLeadData);
    }
  }, [newLeadData, dataLoaded]);

  const updateNewLeadDetails = useCallback(
    (leadDetails: Partial<newLeadType>) => {
      setnewLeadData({ ...newLeadData, ...leadDetails });
    },
    [newLeadData]
  );

  const saveDataToLocalStorage = (
    currentDealData: newLeadInitialValuesType
  ) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDealData));
  };

  const readFromLocalStorage = () => {
    const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!loadedDataString) return setnewLeadData(defaultDeal);
    const validated = newLeadInitialValuesSchema.safeParse(
      JSON.parse(loadedDataString)
    );

    if (validated.success) {
      setnewLeadData(validated.data);
    } else {
      setnewLeadData(defaultDeal);
    }
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setnewLeadData(defaultDeal);
  };

  const contextValue = useMemo(
    () => ({
      newLeadData,
      dataLoaded,
      updateNewLeadDetails,
      resetLocalStorage,
    }),
    [newLeadData, dataLoaded, updateNewLeadDetails]
  );

  return (
    <AddLeadContext.Provider value={contextValue}>
      {children}
    </AddLeadContext.Provider>
  );
};

export function useAddLeadContext() {
  const context = useContext(AddLeadContext);
  if (!context) {
    throw new Error(
      "useAddLeadContext must be used within a AddLeadContextProvider"
    );
  }
  return context;
}
