FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GPE.API/GPE.API.csproj", "GPE.API/"]
COPY ["GPE.Application/GPE.Application.csproj", "GPE.Application/"]
COPY ["GPE.Infrastructure/GPE.Infrastructure.csproj", "GPE.Infrastructure/"]
COPY ["GPE.Domain/GPE.Domain.csproj", "GPE.Domain/"]
RUN dotnet restore "GPE.API/GPE.API.csproj"
COPY . .
WORKDIR "/src/GPE.API"
RUN dotnet build "GPE.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GPE.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GPE.API.dll"]