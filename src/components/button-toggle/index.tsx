import React from 'react';
import './styles.css';

interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children?: React.ReactNode;
  toggled?: boolean;
}

export default function ButtonToggle({ onClick, children, toggled = false }: Props) {
  return (
    <button onClick={onClick} className={toggled ? 'button-toggled' : ''}>
      {children}
    </button>
  );
}
