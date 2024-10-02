import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faUndo, faRedo, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { ContentSwitcher, Switch, Grid, Row, Column, Stack, Toggle, IconButton, Button, Checkbox } from '@carbon/react';
import { Undo, Redo, Erase } from "@carbon/react/icons" 
import classNames from 'classnames';

type NoteToggleProps = {
  selected: boolean;
  onClick: () => void;
};

function NoteToggle(props: NoteToggleProps) {
  return (
    <div className="note-toggle">
      <button
        className={'note-toggle-button' +
          (props.selected ? ' selected' : '')}
        onClick={props.onClick}
      >
      <FontAwesomeIcon icon={faPencilAlt} />
      </button>
    </div>
  )
}

type GenericButtonProps = {
  onClick: () => void;
  valid: boolean;
};

function UndoButton(props: GenericButtonProps) {
  return (
    <div className="undo">
      <button
        className={"undo-button" + 
        (!props.valid ? ' invalid' : '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faUndo} />
      </button>
    </div>
  )
}

function RedoButton(props: GenericButtonProps) {
  return (
    <div className="redo">
      <button
        className={"redo-button" + 
          (!props.valid ? ' invalid' : '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
  )
}

function EraseButton(props: GenericButtonProps) {
  return (
    <div className="erase">
      <button
        className={"erase-button" + 
          (!props.valid ? ' invalid': '')}
        onClick={props.onClick}
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
    </div>
  )
}

type ButtonsProps = {
  isNoteMode: boolean;
  canErase: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNoteToggle: () => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

function Buttons(props: ButtonsProps) {
  return (
    <div className="buttons">
      <NoteToggle selected={props.isNoteMode} onClick={props.onNoteToggle}/>
      <EraseButton onClick={props.onErase} valid={props.canErase} />
      <UndoButton onClick={props.onUndo} valid={props.canUndo} />
      <RedoButton onClick={props.onRedo} valid={props.canRedo} />
    </div>
  )
}

export {Buttons};
export type {ButtonsProps};


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
            onClick={() => props.onSelectNumber(i + 1)} />
        );
      })}
    </div>
  );
}
export { NumberSelector };
export type { NumberSelectorProps };

interface NumberButtonProps {
  value: number;
  selected?: boolean;
  isCandidate?: boolean;
  onClick: () => void;
}

const NumberButton = ({ value, selected, isCandidate, onClick }: NumberButtonProps) => {
  const classes = classNames('number-button', {
    selected: selected,
    candidate: isCandidate,
  });
  return (
    <button className={classes} onClick={onClick} data-number={value}>
      <span>{value}</span>
    </button>
  );
}

interface ActionButtonProps {
  icon: JSX.Element;
  onClick?: () => void;
  disabled: boolean;
}

const ActionButton = ({ icon, onClick, disabled }: ActionButtonProps) => {
  const classes = classNames('action-button', {
    disabled: disabled,
  });
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {icon}
    </button>
  );
}

interface NumPadProps {
  onSelectNumber: (value: number) => void;
  selectedNumbers: boolean[];
  candidateMode?: boolean;
  canErase?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onErase?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const NumPad = ({ onSelectNumber, selectedNumbers, canErase, canUndo, canRedo, onErase, onUndo, onRedo, candidateMode }: NumPadProps) => (
  <div className='numpad'>
    <NumberButton value={1} onClick={() => onSelectNumber(1)} selected={selectedNumbers[0]} isCandidate={candidateMode}/>
    <NumberButton value={2} onClick={() => onSelectNumber(2)} selected={selectedNumbers[1]} isCandidate={candidateMode}/>
    <NumberButton value={3} onClick={() => onSelectNumber(3)} selected={selectedNumbers[2]} isCandidate={candidateMode}/>
    <ActionButton icon={<Undo />} onClick={onUndo} disabled={!canUndo} />
    <NumberButton value={4} onClick={() => onSelectNumber(4)} selected={selectedNumbers[3]} isCandidate={candidateMode}/>
    <NumberButton value={5} onClick={() => onSelectNumber(5)} selected={selectedNumbers[4]} isCandidate={candidateMode}/>
    <NumberButton value={6} onClick={() => onSelectNumber(6)} selected={selectedNumbers[5]} isCandidate={candidateMode}/>
    <ActionButton icon={<Redo />} onClick={onRedo} disabled={!canRedo} />
    <NumberButton value={7} onClick={() => onSelectNumber(7)} selected={selectedNumbers[6]} isCandidate={candidateMode}/>
    <NumberButton value={8} onClick={() => onSelectNumber(8)} selected={selectedNumbers[7]} isCandidate={candidateMode}/>
    <NumberButton value={9} onClick={() => onSelectNumber(9)} selected={selectedNumbers[8]} isCandidate={candidateMode}/>
    <ActionButton icon={<Erase />} onClick={onErase} disabled={!canErase} />
  </div>
)

export interface ControlsProps {
  candidateMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canErase: boolean;
  selectedNumbers: boolean[];
  onSelectNumber: (value: number) => void;
  onToggleAutoCandidates: () => void;
  autoCandidates?: boolean;
  onNoteToggle: () => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export const Controls = (props: ControlsProps) => (
  <div className='controls'>
    <ContentSwitcher onChange={props.onNoteToggle} selectedIndex={props.candidateMode ? 1 : 0} size="sm" className='note-mode-switcher'>
      <Switch name="normalInput" text='Normal' style={{ justifyContent: "center" }}/>
      <Switch name="candidateInput" text='Candidate' style={{ justifyContent: 'center' }} />
    </ContentSwitcher>
    <NumPad {...props} />
    <Toggle 
      id="auto-candidates" 
      labelText='Auto Candidates' hideLabel
      size='sm'
      onClick={props.onToggleAutoCandidates}
      toggled={props.autoCandidates}
      />
  </div>
)
