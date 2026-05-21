import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Keyword } from "@/types";

const COLLECTION = "keywords";

export async function getKeywordsForTopic(topicId: string): Promise<Keyword[]> {
  const q = query(
    collection(db, COLLECTION),
    where("topicId", "==", topicId)
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? new Date().toISOString(),
    } as Keyword;
  });
  // Sort client-side ascending by creation time (avoids composite index requirement)
  return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addKeyword(
  keyword: Omit<Keyword, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...keyword,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteKeyword(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
