import mongoose, { Model, Schema, models } from 'mongoose'

const TempleImportSessionSchema = new Schema({
  importId: { type: String, required: true, unique: true, index: true },
  fileName: { type: String },
  totalRows: { type: Number, default: 0 },
  validRows: { type: Number, default: 0 },
  invalidRows: { type: Number, default: 0 },
  duplicateRows: { type: Number, default: 0 },
  created: { type: Number, default: 0 },
  updated: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['dry-run', 'running', 'completed', 'completed-with-errors', 'failed'],
    default: 'running',
    index: true,
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  adminUser: { type: Schema.Types.Mixed },
  dryRunReport: { type: Schema.Types.Mixed },
  errorRows: { type: [Schema.Types.Mixed], default: [] },
  warningRows: { type: [Schema.Types.Mixed], default: [] },
}, { timestamps: true })

TempleImportSessionSchema.index({ startedAt: -1 })
TempleImportSessionSchema.index({ status: 1, startedAt: -1 })

const TempleImportSession = (models.TempleImportSession as any) || (mongoose.model as any)('TempleImportSession', TempleImportSessionSchema)

export default TempleImportSession as Model<any>
