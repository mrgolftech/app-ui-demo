import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useDemoAuth } from './DemoAuth';
export function RequireDemoAuth({children}:{children:ReactNode}){
 const {signedIn}=useDemoAuth();
 const location=useLocation();
 if(!signedIn)return <Navigate to="/login" replace state={{from:location.pathname}}/>;
 return <>{children}</>;
}
