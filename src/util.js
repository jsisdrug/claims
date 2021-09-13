function reflect(promise) {
  return promise.then(
    (r) => ({ result: r, status: "SUCCESS" }),
    (e) => ({ error: e, status: "FAILED" })
  );
}
export async function afterAll(promises) {
  return Promise.all(promises.map((p) => reflect(p)));
}

export function getChunks(arr, range) {
  const chunks = [];
  while (arr.length > 0) {
    chunks.push(arr.splice(0, range));
  }
  return chunks;
}
