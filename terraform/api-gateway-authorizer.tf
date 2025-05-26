module "jwt_authorizer_lambda" {
  source = "./modules/lambda"

  function_name             = "jwt-authorizer"
  lambda_role_arn           = module.lambda_shared.lambda_role_arn
  zip_file                  = "${path.module}/../lambdas/jwt-authorizer.zip"
  source_code_hash          = filebase64sha256("${path.module}/../lambdas/jwt-authorizer.zip")
  api_gateway_id            = module.api_gateway.api_id
  api_gateway_execution_arn = module.api_gateway.execution_arn

  environment_variables = {
    JWT_SECRET_KEY = var.jwt_secret_key
  }
}

resource "aws_apigatewayv2_authorizer" "jwt_authorizer" {
  api_id           = module.api_gateway.api_id
  authorizer_type  = "REQUEST"
  identity_sources = ["$request.header.Authorization"]
  name             = "jwt-authorizer"
  authorizer_uri   = module.jwt_authorizer_lambda.invoke_arn
  authorizer_payload_format_version = "2.0"
}
