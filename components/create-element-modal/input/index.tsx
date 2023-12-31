import { TreeNode } from "@/data-structures/tree";
import { Property } from "@/infra-elements/templates/type";
import { ResourceInput } from "./resource-input";
import { DefaultInput } from "./text-input";

export interface InputProps {
  property: Property;
  onChange?: (value: any) => void;
  root?: TreeNode
}

const getInputComponent = (inputType: string | undefined) => {
  switch(inputType) {
    case "resource":
      return ResourceInput
    default:
      return DefaultInput
  }
//  switch(inputType) {
//    TODO
//    case "multi-select":
//      return MultiSelectInput
//    case "select":
//      return SimpleSelect
//    default:
}

export function Input({ property, onChange, root }: InputProps) {
  let label = property.name;
  if (property.isRequired) {
    label += " *";
  }

  const InputComponent = getInputComponent(property.input?.type)

  return (
    <div className="flex flex-col items-start justify-center mt-3">
      <p>{label}</p>

      <InputComponent property={property} onChange={onChange} root={root} />
    </div>
  );
}
