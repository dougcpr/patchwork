import {FloppyDiskIcon} from "@phosphor-icons/react";

export const BoulderingGradeFooter = () => {
  const save = () => {
    console.log('save');
  }
  return (
    <button onClick={save} className="footer">
      <FloppyDiskIcon />
    </button>
  )
}