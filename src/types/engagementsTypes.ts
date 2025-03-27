export type Engagement = {
  engagement: {
    id: number;
    type: string;
    timestamp: number;
    bodyPreview: string;
  };
  metadata: {
    from?: { email: string; firstName: string; lastName: string };
    to?: Array<{ email: string; firstName: string; lastName: string }>;
    subject?: string;
    toNumber?: string;
    fromNumber?: string;
    status: string;
    title: string;
    durationMilliseconds?: number;
    body: string;
    html: string;
    text: string;
    priority: string;
    taskType: string;
  };
};
