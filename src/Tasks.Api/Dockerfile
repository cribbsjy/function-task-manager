FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/Tasks.Api/Tasks.Api.csproj ./src/Tasks.Api/
RUN dotnet restore ./src/Tasks.Api/Tasks.Api.csproj

COPY . .

RUN dotnet build ./src/Tasks.Api/Tasks.Api.csproj -c Release

RUN dotnet publish ./src/Tasks.Api/Tasks.Api.csproj -c Release -o /app/out /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
RUN mkdir -p /app/data 

COPY --from=build /app/out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Tasks.Api.dll"]