import { Switch } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export interface ToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  sideBySide: boolean;
  setSideBySide: (sideBySide: boolean) => void;
}

export default function Toggle({
  sideBySide,
  setSideBySide,
  ...props
}: ToggleProps) {
  return (
    <div />
    // </Switch.Group>
  );
}
