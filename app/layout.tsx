import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import Header from './Header';
export const metadata: Metadata = { title: 'Regeneración Nº 132 · Masonería en Valencia', description: 'Sitio oficial de la R.·.L.·.S.·. Regeneración Nº 132, Logia masónica en Valencia.', metadataBase: new URL('https://regeneracion132.es'), openGraph: { title: 'Regeneración Nº 132', description: 'Fraternidad, estudio y perfeccionamiento personal en Valencia.', images: ['/Logo_Regeneracion_132.png'] } };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body><Header/>{children}<footer className="footer"><div className="wrap"><div className="brand"><Image src="/Logo_Regeneracion_132.png" alt="" width={46} height={46}/><span>R.·.L.·.S.·. REGENERACIÓN Nº 132</span></div><small>Oriente de Valencia · Gran Logia de España · Gran Logia Provincial de Valencia<br/>La información pública está sujeta a revisión y autorización institucional.</small></div></footer></body></html>}
