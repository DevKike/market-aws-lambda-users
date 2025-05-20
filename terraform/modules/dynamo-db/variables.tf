variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
  default     = "users"
}

variable "billing_mode" {
  description = "Controls how you are charged for read and write throughput"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "hash_key" {
  description = "Partition key name"
  type        = string
  default     = "id"
}

variable "hash_key_type" {
  description = "Partition key type"
  type        = string
  default     = "S"
}