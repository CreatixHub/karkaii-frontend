import MessageComposer from '@/views/communication/compose/MessageComposer';
import { channels } from '@/views/communication/compose/channels.data';

const PushNotificationsPage = () => <MessageComposer config={channels['push']} />;

export default PushNotificationsPage;
