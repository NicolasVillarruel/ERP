export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          organization_id: string
          name: string
          internal_code: string | null
          type: 'raw' | 'semi_finished' | 'finished' | 'service'
          uom: string
          cost_standard: number
          lot_control: boolean
          serial_control: boolean
          attributes: Json
          active: boolean
          created_at: string
          updated_at: string
        }
      }
      boms: {
        Row: {
          id: string
          organization_id: string
          product_id: string
          version: number
          name: string | null
          active: boolean
          valid_from: string | null
          valid_to: string | null
          notes: string | null
          created_at: string
        }
      }
      bom_lines: {
        Row: {
          id: string
          bom_id: string
          component_id: string
          quantity: number
          uom: string | null
          scrap_rate: number
          level: number
          sequence: number
          attributes: Json
        }
      }
      work_centers: {
        Row: {
          id: string
          organization_id: string
          name: string
          code: string | null
          capacity_hours_per_day: number
          cost_per_hour: number | null
          type: 'machine' | 'labor' | 'assembly' | 'quality' | null
          attributes: Json
        }
      }
      routings: {
        Row: {
          id: string
          organization_id: string
          bom_id: string | null
          name: string | null
          version: number
          active: boolean
        }
      }
      routing_operations: {
        Row: {
          id: string
          routing_id: string
          work_center_id: string
          operation_name: string
          sequence: number | null
          duration_hours: number | null
          attributes: Json
        }
      }
      manufacturing_orders: {
        Row: {
          id: string
          organization_id: string
          product_id: string
          bom_id: string | null
          routing_id: string | null
          quantity_planned: number
          quantity_produced: number
          planned_start: string | null
          planned_end: string | null
          actual_start: string | null
          actual_end: string | null
          status: 'draft' | 'confirmed' | 'in_progress' | 'done' | 'cancelled'
          priority: number
          notes: string | null
          created_at: string
        }
      }
      work_orders: {
        Row: {
          id: string
          mo_id: string
          operation_id: string | null
          work_center_id: string
          quantity: number | null
          duration_hours: number | null
          status: 'pending' | 'in_progress' | 'done' | null
          started_at: string | null
          completed_at: string | null
        }
      }
      production_moves: {
        Row: {
          id: string
          mo_id: string | null
          product_id: string
          quantity: number | null
          move_type: 'consume' | 'produce' | 'scrap' | null
          lot_number: string | null
          warehouse_location: string | null
          created_at: string
        }
      }
    }
  }
}

// Helper types for easier use in components
export type Product = Database['public']['Tables']['products']['Row']
export type Bom = Database['public']['Tables']['boms']['Row']
export type WorkCenter = Database['public']['Tables']['work_centers']['Row']
export type ManufacturingOrder = Database['public']['Tables']['manufacturing_orders']['Row']
export type ProductionMove = Database['public']['Tables']['production_moves']['Row']
