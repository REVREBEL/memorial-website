import { DevLinkProvider } from '../site-components/DevLinkProvider';
import { Footer } from '../site-components/Footer';

export function FooterWrapper() {
  return (
    <DevLinkProvider>
      <Footer />
    </DevLinkProvider>
  );
}
