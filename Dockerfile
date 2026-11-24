FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY ["API/API.csproj", "API/"]

RUN dotnet restore "API/API.csproj"

COPY . .

WORKDIR /src/API

RUN dotnet publish "API.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "dotnet API.dll --urls http://0.0.0.0:${PORT:-10000}"]
