module "lambda_shared" {
  source    = "./modules/shared-resources"
  role_name = "users_lambda_role"
}

# Create user Lambda
data "archive_file" "create_user_zip" {
  type        = "zip"
  source_dir = "${path.module}/../dist/src/infrastructure/lambdas/create-user"
  output_path = "${path.module}/../lambdas/create-user.zip"
}

module "create_user_lambda" {
  source = "./modules/lambda"

  function_name             = "create-user"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = data.archive_file.create_user_zip.output_path
  source_code_hash          = data.archive_file.create_user_zip.output_base64sha256
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    ENV = "dev"
  }
}

# Api Gateway Routes
resource "aws_apigatewayv2_route" "create_user_route" {
  api_id    = module.api_gateway.api_id
  route_key = "POST /users"
  target    = "integrations/${module.create_user_lambda.integration_id}"
}
