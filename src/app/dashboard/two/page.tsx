import { CONFIG } from 'src/config-global';
import { ImagesResizeView } from 'src/sections/image-resize/view';



// ----------------------------------------------------------------------

export const metadata = { title: `Page two | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ImagesResizeView title="Page two" />;
}
