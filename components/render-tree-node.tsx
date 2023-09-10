"use client";
import { TreeNode } from "@/data-structures/tree";
import { useHierarchy } from "@/contexts/hierarchy";

function ShowNodeDetails({ node }: { node: TreeNode }) {
  const properties = Object.entries(node.element.properties).filter(
    ([key]) => key !== "name"
  );
  const propertiesInfos = properties.map(([key, value]) => {
    return (
      <div key={key}>
        <span className="font-bold">{key}</span>: {String(value)}
      </div>
    );
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-start">
        <h1 className="font-bold mr-3 text-xl">{node.name}</h1>
        <span>| {node.element.type}</span>
      </div>

      <div className="flex flex-col mt-3">{propertiesInfos}</div>
    </div>
  );
}

interface RenderTreeNodeProps {
  node: TreeNode;
  isRoot?: boolean;
}

export function RenderTreeNode({ node, isRoot }: RenderTreeNodeProps) {
  const hierarchy = useHierarchy();

  const onAdd = () => {
    hierarchy.setSelectedNode(node);
  };

  const onDelete = () => {
    hierarchy.removeContainer(node.id);
  };

  const mappedElements = node.children.map((child) => {
    return <RenderTreeNode key={child.id} node={child} />;
  });

  return (
    <div className="my-5 p-3 px-10 border-solid border-2 border-black bg-zinc-950 rounded-md flex flex-col justify-center">
      <ShowNodeDetails node={node} />

      <div>{mappedElements}</div>

      <div className="flex items-center">
        <button
          className="rounded-md bg-zinc-900 p-3 max-w-xs mt-3 mr-3"
          type="button"
          onClick={onAdd}
        >
          Add
        </button>

        {!isRoot && (
          <button
            className="rounded-md bg-zinc-900 p-3 max-w-xs mt-3"
            type="button"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
