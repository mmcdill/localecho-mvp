import { useRouter } from 'next/router';

export default function ReviewDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Review Details</h1>
      <p>Viewing review ID: {id}</p>
    </div>
  );
}
