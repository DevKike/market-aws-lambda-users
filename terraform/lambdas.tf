module "lambda_shared" {
  source             = "./modules/shared-resources"
  role_name          = "users_lambda_role"
  dynamodb_table_arn = module.dynamodb.table_arn
}

# Create user Lambda
module "create_user_lambda" {
  source = "./modules/lambda"

  function_name             = "create-user"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = "${path.module}/../lambdas/create-user.zip"
  source_code_hash          = filebase64sha256("${path.module}/../lambdas/create-user.zip")
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    ENV         = "dev"
    USERS_TABLE = module.dynamodb.table_name
  }
}

# Api Gateway Routes
resource "aws_apigatewayv2_route" "create_user_route" {
  api_id    = module.api_gateway.api_id
  route_key = "POST /users"
  target    = "integrations/${module.create_user_lambda.integration_id}"
}
