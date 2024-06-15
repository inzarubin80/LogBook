package server

import (
	"log"
	"net/http"
	"runtime/debug"

	"github.com/inzarubin80/Logbook/auth/db"
	"github.com/inzarubin80/Logbook/auth/env"
	"github.com/inzarubin80/Logbook/auth/errors"
	"github.com/inzarubin80/Logbook/auth/server/handlers"
	"github.com/inzarubin80/Logbook/auth/server/write"
	"github.com/julienschmidt/httprouter"
)

func (srv *server) ConfigureRouter() {
	srv.router = httprouter.New()

	// setup error handlers for our router
	srv.router.MethodNotAllowed = write.Error(errors.BadRequestMethod)
	srv.router.NotFound = write.Error(errors.RouteNotFound)
	srv.router.PanicHandler = func(w http.ResponseWriter, r *http.Request, err interface{}) {
		log.Println("Panic on", r.URL.Path)
		debug.PrintStack()
		write.Error(errors.InternalError)(w, r)
	}

	// SESSION
	srv.POST("/session", handlers.Login)
	srv.DELETE("/session", handlers.Logout)

	// RESETS
	srv.POST("/reset", handlers.CreateReset)
	srv.GET("/reset/:code", handlers.DoReset)

	// USER
	srv.POST("/user", handlers.Signup)
	srv.GET("/user", handlers.Whoami)
	srv.POST("/user/verify", handlers.Verify)
	srv.PUT("/user/password", handlers.UpdatePassword)

	// Categorys
	srv.GET("/category", handlers.GetCategorys)
	srv.GET("/categoryByName/:name", handlers.GetCategorysByName)
	srv.GET("/category/:id", handlers.GetCategory)
	srv.POST("/category", handlers.CreateCategory)
	srv.PUT("/category", handlers.UpdateCategory)
	srv.DELETE("/category/:id", handlers.DeleteCategory)

	// SportSchool
	srv.GET("/sportSchool", handlers.GetSportSchools)
	srv.GET("/sportSchool/:id", handlers.GetSportSchool)
	srv.POST("/sportSchool", handlers.CreateSportSchool)
	srv.PUT("/sportSchool", handlers.UpdateSportSchool)
	srv.DELETE("/sportSchool/:id", handlers.DeleteSportSchool)

	// Coache
	srv.GET("/coache", handlers.GetCoaches)
	srv.GET("/coache/:id", handlers.GetCoache)
	srv.POST("/coache", handlers.CreateCoache)
	srv.PUT("/coache", handlers.UpdateCoache)
	srv.DELETE("/coache/:id", handlers.DeleteCoache)

	//TypeTournament
	srv.GET("/typeTournament", handlers.GetTypeTournaments)
	srv.GET("/typeTournament/:id", handlers.GetTypeTournament)
	srv.POST("/typeTournament", handlers.CreateTypeTournament)
	srv.PUT("/typeTournament", handlers.UpdateTypeTournament)
	srv.DELETE("/typeTournament/:id", handlers.DeleteTypeTournament)

	//TypeTournament
	srv.GET("/categoryValue", handlers.GetCategoryValues)
	srv.GET("/categoryValue/:id", handlers.GetCategoryValue)
	srv.POST("/categoryValue", handlers.CreateCategoryValue)
	srv.PUT("/categoryValue", handlers.UpdateCategoryValue)
	srv.DELETE("/categoryValue/:id", handlers.DeleteCategoryValue)

}

// srvHandler is the extended handler function that our API routes use
type srvHandler func(env env.Env, user *db.User, w http.ResponseWriter, r *http.Request) http.HandlerFunc

// helpers for easily adding routes
func (srv *server) GET(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodGet, path, srv.wrap(handler))
}
func (srv *server) PUT(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodPut, path, srv.wrap(handler))
}
func (srv *server) POST(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodPost, path, srv.wrap(handler))
}
func (srv *server) DELETE(path string, handler srvHandler) {
	srv.router.HandlerFunc(http.MethodDelete, path, srv.wrap(handler))
}

// wrap does all the middleware together
func (srv *server) wrap(h srvHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// convert our fancy handler to a normal handlerFunc
		fn := withUserAndEnv(srv.env, h, w, r)
		// wrap it with middlewares
		wrapped := lag(csrf(cors(fn)))
		// execute the wrapped handler
		wrapped(w, r)
	}
}
