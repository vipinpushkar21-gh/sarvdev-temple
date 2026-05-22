// models/ActivityLog.ts
import mongoose, { Schema, models } from 'mongoose'

const ActivityLogSchema = new Schema({
  action: { type: String, required: true }, // 'approve', 'reject', 'delete', 'create', 'update'
  entity: { type: String, required: true }, // 'temple', 'devotional', 'blog', 'event', 'user', 'darshan'
  entityId: { type: String },
  entityTitle: { type: String },
  adminId: { type: String },
  adminName: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
})

ActivityLogSchema.index({ timestamp: -1 })

const ActivityLog: any = (models.ActivityLog as any) || mongoose.model<any>('ActivityLog', ActivityLogSchema as any)

export default ActivityLog
