import type { ButtonHTMLAttributes, ReactNode } from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{
 icon:ReactNode;label:string;tone?:'plain'|'primary'|'white'|'soft';compact?:boolean;
};
export function IconButton({icon,label,tone='plain',compact=false,className='',...rest}:Props){
 return <button type="button" {...rest} aria-label={label} title={label}
  className={'icon-button icon-button--'+tone+(compact?' icon-button--compact':'')+' '+className}>
  {icon}<span className="sr-only">{label}</span>
 </button>;
}
