import { IndexInfo } from "@/types/interfaces";

export async function getCurrentIndex(): Promise<IndexInfo> {
  const response = await fetch('/api/index/loadIndexes');
  
  if (!response.ok) {
    throw new Error('Failed to load index data');
  }

  const data = await response.json();

  return data[0] as IndexInfo;
}