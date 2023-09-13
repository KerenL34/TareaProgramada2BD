DECLARE @xmlData XML		-- Stores the xml data

-- load xml data
SET @xmlData = (
	SELECT *
	FROM OPENROWSET(
		BULK 'C:\Users\keren\OneDrive\Escritorio\Bases de Datos I\Tarea2\Prueba.xml'
		, SINGLE_BLOB)
		AS xmlData
);

-- Insertar users con el xml cargado 
INSERT INTO dbo.[User]
    ([Nombre]
    , [Clave])
SELECT
    T.Item.value('@Nombre', 'VARCHAR(32)')
    , T.Item.value('@Clave', 'VARCHAR(32)')
FROM @xmlData.nodes('root/Usuarios/Usuario') AS T(Item)

-- insertar clase de articulo con el xml cargado 
INSERT INTO dbo.ArticleType
	([Nombre])
SELECT
	T.Item.value('@Nombre', 'VARCHAR(128)')
FROM @xmlData.nodes('root/ClasesdeArticulos/ClasesdeArticulo') AS T(Item)

-- insert articles from loaded xml data
INSERT INTO dbo.Article
	(
		idArticleType
		, [Name]
		, Price
	)
SELECT
    (
		SELECT C.Id
		FROM dbo.ArticleType C
		WHERE C.[Name] = T.Item.value('@ClasesdeArticulo', 'VARCHAR(128)')
	)
	, T.Item.value('@Nombre', 'VARCHAR(2000)')
	, T.Item.value('@precio', 'MONEY')
FROM @xmlData.nodes('root/Articulos/Articulo') AS T(Item)