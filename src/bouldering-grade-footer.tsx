export const BoulderingGradeFooter = () => {
  const save = () => {
    console.log('save');
  }
  return (
    <button onClick={save} className="footer">
      Save
    </button>
  )
}