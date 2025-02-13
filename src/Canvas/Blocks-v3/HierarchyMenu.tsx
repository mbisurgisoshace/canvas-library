import {
  UncontrolledTreeEnvironment,
  Tree,
  ControlledTreeEnvironment,
  StaticTreeDataProvider,
} from "react-complex-tree";

import "react-complex-tree/lib/style-modern.css";
import { useCanvas } from "./CanvasContext";
import { useCallback, useMemo, useState } from "react";
import { traverseAllElements } from "./utils";

export default function HierarchyTree() {
  const { elements, selectElement } = useCanvas();
  const [focusedItem, setFocusedItem] = useState();
  const [expandedItems, setExpandedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const items = useMemo(() => {
    const treeElements: Record<string, any> = {};
    const allElements = traverseAllElements(elements);
    const root = {
      index: "root",
      isFolder: true,
      children: [...elements.map((element) => element.id)],
      data: "Root item",
    };

    allElements.forEach((element) => {
      treeElements[element.id] = {
        index: element.id,
        isFolder: true,
        children: [...element.children.map((child) => child.id)],
        data: element,
        label: element.blockType,
      };
    });

    return {
      root,
      ...treeElements,
    };
  }, [elements]);

  const dataProvider = useMemo(
    () =>
      new StaticTreeDataProvider(items, (item, data) => ({
        ...item,
        data,
      })),
    [items]
  );

  return (
    <ControlledTreeEnvironment
      //dataProvider={dataProvider}
      items={items}
      viewState={{
        ["tree-1"]: {
          focusedItem,
          expandedItems,
          selectedItems,
        },
      }}
      onSelectItems={(items) =>
        selectElement({ elementId: items[0] as string })
      }
      onFocusItem={(item) => setFocusedItem(item.index)}
      onExpandItem={(item) => setExpandedItems([...expandedItems, item.index])}
      onCollapseItem={(item) =>
        setExpandedItems(
          expandedItems.filter(
            (expandedItemIndex) => expandedItemIndex !== item.index
          )
        )
      }
      getItemTitle={(item) => item.label}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </ControlledTreeEnvironment>
  );
}
