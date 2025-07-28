import {FloppyDiskIcon} from "@phosphor-icons/react";

export const BoulderingGradeFooter = ({saveNote} : any) => {
  return (
    <button onClick={() => saveNote()} className="footer">
      <FloppyDiskIcon />
    </button>
  )
}