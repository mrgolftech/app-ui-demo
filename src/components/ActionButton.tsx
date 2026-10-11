import type { ButtonHTMLAttributes, ReactNode } from 'react';
type ActionButtonProps=ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;tone?:'blue'|'purple'|'orange'|'pale';};
export function ActionButton({children,tone='pale',className='',...props}:ActionButtonProps){
  return <button type="button" {...props} className={'action-button action-button--'+tone+' '+className}>{children}</button>;
}
