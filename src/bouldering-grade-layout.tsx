import type {ReactNode} from "react";

type BoulderingGradeLayoutProps = {
  children: ReactNode;
};

export const BoulderingGradeLayout = ({ children }: BoulderingGradeLayoutProps) => {
  return (
    <div className="homepage-layout">
      {children}
    </div>
  )
}