import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:3002", "http://localhost:3000"],
    credentials: true
  }
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private adminClients: Set<Socket> = new Set();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.adminClients.add(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.adminClients.delete(client);
  }

  // Admin paneline bağlan
  @SubscribeMessage('joinAdmin')
  handleJoinAdmin(client: Socket) {
    client.join('admin-room');
    client.emit('adminJoined', { message: 'Admin paneline bağlandın' });
  }

  // Tüm admin client'lara güncelleme gönder
  notifyAdmins(event: string, data: any) {
    this.server.to('admin-room').emit(event, data);
  }

  // Video eklendiğinde
  notifyVideoAdded(video: any) {
    this.notifyAdmins('videoAdded', video);
  }

  // Series eklendiğinde
  notifySeriesAdded(series: any) {
    this.notifyAdmins('seriesAdded', series);
  }

  // Stats güncellendiğinde
  notifyStatsUpdated(stats: any) {
    this.notifyAdmins('statsUpdated', stats);
  }

  // User eklendiğinde
  notifyUserAdded(user: any) {
    this.notifyAdmins('userAdded', user);
  }

  // Settings güncellendiğinde
  notifySettingsUpdated(settings: any) {
    this.notifyAdmins('settingsUpdated', settings);
  }

  // System info güncellendiğinde
  notifySystemInfoUpdated(info: any) {
    this.notifyAdmins('systemInfoUpdated', info);
  }
}
