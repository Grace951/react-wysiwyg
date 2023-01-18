import { FC } from 'react';
type ButtonStyle = {
  [property: string]: string;
};
export interface ButtonProps {
  label: string;
  style: ButtonStyle;
  onClick: () => void;
}
const Button: FC<ButtonProps> = ({ label, style, onClick }) => {
  return (
    <button style={style} onClick={onClick}>
      {label}
    </button>
  );
};
export default Button;
