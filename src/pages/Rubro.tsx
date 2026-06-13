import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getBrazo } from './brazos';
import BrazoLayout from '../layouts/BrazoLayout';

export default function Rubro() {
  const { slug } = useParams<{ slug: string }>();
  const brazo = slug ? getBrazo(slug) : null;

  // SEO dinámico — actualiza title, description, og:tags
  useEffect(() => {
    if (!brazo) return;
    const oldTitle = document.title;
    document.title = `${brazo.nombre} | ADAMGRÁFICA`;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', brazo.descripcionCorta);
    setMeta('keywords', `${brazo.nombre.toLowerCase()}, branding, marketing, redes sociales, ${brazo.tagline}`);

    return () => {
      document.title = oldTitle;
    };
  }, [brazo]);

  if (!brazo) {
    return <Navigate to="/" replace />;
  }

  return <BrazoLayout brazo={brazo} />;
}
