module "lambda_shared" {
  source             = "./modules/shared-resources"
  role_name          = "users_lambda_role"
  dynamodb_table_arn = module.dynamodb.table_arn
}

# Sign up user Lambda
module "sign_up" {
  source = "./modules/lambda"

  function_name             = "sign-up"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = "${path.module}/../lambdas/sign-up.zip"
  source_code_hash          = filebase64sha256("${path.module}/../lambdas/sign-up.zip")
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    ENV         = "dev"
    USERS_TABLE = module.dynamodb.table_name
  }
}

# Sign in user Lambda
module "sign_in" {
  source = "./modules/lambda"

  function_name             = "sign-in"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = "${path.module}/../lambdas/sign-in.zip"
  source_code_hash          = filebase64sha256("${path.module}/../lambdas/sign-in.zip")
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    ENV            = "dev"
    USERS_TABLE    = module.dynamodb.table_name
    JWT_SECRET_KEY = var.jwt_secret_key
  }
}

# Get user info Lambda
module "user_info" {
  source = "./modules/lambda"

  function_name             = "user-info"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = "${path.module}/../lambdas/user-info.zip"
  source_code_hash          = filebase64sha256("${path.module}/../lambdas/user-info.zip")
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    ENV         = "dev"
    USERS_TABLE = module.dynamodb.table_name
  }
}

# Api Gateway Routes
resource "aws_apigatewayv2_route" "sign_up_route" {
  api_id    = module.api_gateway.api_id
  route_key = "POST /users/sign-up"
  target    = "integrations/${module.sign_up.integration_id}"
}

resource "aws_apigatewayv2_route" "sign_in_route" {
  api_id    = module.api_gateway.api_id
  route_key = "POST /users/sign-in"
  target    = "integrations/${module.sign_in.integration_id}"
}

resource "aws_apigatewayv2_route" "user_info_route" {
  api_id             = module.api_gateway.api_id
  route_key          = "GET /users/me"
  target             = "integrations/${module.user_info.integration_id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt_authorizer.id
}
