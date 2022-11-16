
type NumberSelectorButtonProps = {
  value: number;
  isSelected: boolean;
  onClick: () => void;
}

function NumberSelectorButton(props: NumberSelectorButtonProps) {
  return (
      <button
        className={'number-selector-button' + (props.isSelected ? ' selected' : '')}
        onClick={props.onClick}>
        {props.value}
      </button>
  );
}

type NumberSelectorProps = {
  currentSelection: boolean[];
  onSelectNumber: (value: number) => void;
}

function NumberSelector(props: NumberSelectorProps) {
  return (
    <div className='number-selector'>
      {Array.from(Array(9).keys()).map((i) => {
        return (
          <NumberSelectorButton
            key={i}
            value={i + 1}
            isSelected={props.currentSelection[i]}
            onClick={() => props.onSelectNumber(i)} />
        );
      })}
    </div>
  );
}
export { NumberSelector };
export type { NumberSelectorProps };