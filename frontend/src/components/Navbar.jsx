import React from 'react';
import { Landmark, ShieldCheck } from 'lucide-react';
export default function Navbar(){return <header className="nav"><a className="brand" href="/"><span className="brand-icon"><Landmark/></span><span>Seva<span>Setu</span></span></a><div className="nav-trust"><ShieldCheck/> Trusted government links</div></header>}
