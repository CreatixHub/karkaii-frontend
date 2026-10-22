import MessageComposer from '@/views/communication/compose/MessageComposer';
import { channels } from '@/views/communication/compose/channels.data';

const BulkSmsPage = () => <MessageComposer config={channels['bulk-sms']} />;

export default BulkSmsPage;
