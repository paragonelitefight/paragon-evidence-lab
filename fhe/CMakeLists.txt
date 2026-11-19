cmake_minimum_required(VERSION 3.16)
project(paragon_fhe_synthetic CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
find_package(OpenFHE CONFIG REQUIRED)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${OpenFHE_CXX_FLAGS}")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${OpenFHE_EXE_LINKER_FLAGS}")
include_directories(${OPENMP_INCLUDES} ${OpenFHE_INCLUDE} ${OpenFHE_INCLUDE}/third-party/include ${OpenFHE_INCLUDE}/core ${OpenFHE_INCLUDE}/pke ${OpenFHE_INCLUDE}/binfhe)
link_directories(${OpenFHE_LIBDIR} ${OPENMP_LIBRARIES})
add_executable(paragon_fhe main.cpp)
target_link_libraries(paragon_fhe PRIVATE ${OpenFHE_SHARED_LIBRARIES})
# Requires a separately installed, version-qualified OpenFHE shared build.
# Not compiled, linked, benchmarked or tested by the assistant.
