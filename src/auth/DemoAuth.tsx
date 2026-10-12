import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const KEY='app-ui-demo-session';
interface DemoAuthState { signedIn:boolean; signIn:()=>void; signOut:()=>void }
const AuthContext=createContext<DemoAuthState | null>(null);

// Demo-only login: no backend calls, no real authentication, no password storage.
export function DemoAuthProvider({children}:{children:ReactNode}){
 const [signedIn,setSignedIn]=useState(()=>sessionStorage.getItem(KEY)==='yes');
 const signIn=useCallback(()=>{sessionStorage.setItem(KEY,'yes');setSignedIn(true);},[]);
 const signOut=useCallback(()=>{sessionStorage.removeItem(KEY);setSignedIn(false);},[]);
 const auth=useMemo(()=>({signedIn,signIn,signOut}),[signedIn,signIn,signOut]);
 return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export function useDemoAuth(){
 const value=useContext(AuthContext);
 if(!value)throw new Error('DemoAuthProvider is required');
 return value;
}
