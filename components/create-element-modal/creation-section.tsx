import { useHierarchy } from "@/contexts/hierarchy";
import { useTemplate } from "@/hooks/template";
import { InfraElement } from "@/infra-elements/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { Input } from "./input";

interface AvailableElementsProps {
  parentElement: InfraElement;
  onSelect: (elementType: string) => void;
}

function AvailableElements(props: AvailableElementsProps) {
  const template = useTemplate(props.parentElement.type);

  const childTypeButtons = template.childrenElementTypes.map((type) => {
    return (
      <li key={type}>
        <button
          className="rounded-md bg-gray-700 p-3 max-w-xs mt-3 mr-3"
          onClick={() => props.onSelect(type)}
        >
          {type}
        </button>
      </li>
    );
  });

  return (
    <section>
      <h3>Select one available child element type</h3>

      <ul>{childTypeButtons}</ul>
    </section>
  );
}

interface ElementCreationSetupProps {
  elementType: string;
}

function ElementCreationSetup({ elementType }: ElementCreationSetupProps) {
  const hierarchy = useHierarchy();
  const template = useTemplate(elementType);

  const [propertyValues, setPropertyValues] = useState<Record<string, string>>(
    {}
  );

  const inputs = template.properties.map((property) => {
    return (
      <li key={property.name}>
        <Input
          property={property}
          onChange={(value) =>
            setPropertyValues({
              ...propertyValues,
              [property.name]: value,
            })
          }
        />
      </li>
    );
  });

  const onCreate = () => {
    if (!template.isAllRequiredFieldsFilled(propertyValues)) {
      toast.error("You must fill all required properties");
      return;
    }

    if (hierarchy.selectedNode === null) {
      toast.error("You must select a parent element");
      return;
    }

    hierarchy.addContainer(hierarchy.selectedNode.id, {
      name: propertyValues?.name || elementType,
      element: {
        type: elementType,
        properties: propertyValues,
      },
      children: [],
      parentId: hierarchy.selectedNode.id
    });
    hierarchy.setSelectedNode(null);
  };

  return (
    <section className="w-full flex flex-col">
      <h3>Fill the properties of the new {elementType}</h3>

      <ul>{inputs}</ul>

      <span className="mt-5">* Required fields</span>

      <button
        type="button"
        onClick={onCreate}
        className="inline-flex justify-center rounded-md bg-green-600 px-3 py-2 mt-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 w-40"
      >
        Create
      </button>
    </section>
  );
}

interface CreationSectionProps {
  parentElement: InfraElement;
}

export function CreationSection({ parentElement }: CreationSectionProps) {
  const [selectedElementType, setSelectedElementType] = useState<string | null>(
    null
  );

  if (selectedElementType === null)
    return (
      <AvailableElements
        parentElement={parentElement}
        onSelect={setSelectedElementType}
      />
    );

  return <ElementCreationSetup elementType={selectedElementType} />;
}
