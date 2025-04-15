export default function ToneSelector() {
  return (
    <div style={{ margin: "1rem 0" }}>
      <label htmlFor="tone">Tone:</label>
      <select id="tone" name="tone">
        <option value="friendly">Friendly</option>
        <option value="professional">Professional</option>
        <option value="empathetic">Empathetic</option>
      </select>
    </div>
  );
}
