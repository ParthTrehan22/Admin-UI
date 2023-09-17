export default async function fetchData() {
  const response = await fetch(
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
  );
  const data = await response.json();
  return data;
}
