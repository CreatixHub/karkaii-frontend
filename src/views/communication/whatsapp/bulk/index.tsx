import MessageComposer from '@/views/communication/compose/MessageComposer';
import { channels } from '@/views/communication/compose/channels.data';

const BulkWhatsappPage = () => <MessageComposer config={channels['bulk-whatsapp']} />;

export default BulkWhatsappPage;
