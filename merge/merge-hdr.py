#!/usr/bin/python
import sys, getopt
import cv2 as cv
import numpy as np

def mergeHdr():


def main(argv):
	rootFolder = ''
	imageNames = ''
	outputName = 'hdr-image.jpg'
	contrast = 0
	saturation = 0
	exposure = 0
	print(argv)
	try:
		opts, args = getopt.getopt(argv, 'hr:i:o:C:	s:e:', ['root_folder=', 'images=', 'output=', 'contrast=', 'saturation=', 'exposure='])
	except getopt.GetoptError as err:
		print('merge-hdr.py -r <root_folder> -i <images>')
		print('merge-hdr.py -o <output.ext> -c <number> -s <number> -e <number>')
		print("OS error: ${0}".format(err))
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print('merge-hdr.py -r <root_folder> -i <images>')
			sys.exit(0)
		elif opt in ('-r', '--root_folder'):
			rootFolder = arg
		elif opt in ('-i', '--images'):
			imageNames = arg.split(',')
		elif opt in ('-o', '--output'):
			outputName = arg
		elif opt in ('-C', '--contrast'):
			contrast = float(arg)
			print(contrast)
		elif opt in ('-s', '--saturation'):
			saturation = float(arg)
			print(saturation)
		elif opt in ('-e', '--exposure'):
			exposure = float(arg)
			print(exposure)

	# Loading exposure images into a list
	imgs = list(map(lambda s: rootFolder + '/' + s, imageNames))
	img_list = [cv.imread(fn) for fn in imgs]

	# Exposure fusion using Mertens
	merge_mertens = cv.createMergeMertens(contrast, saturation, exposure)
	res_mertens = merge_mertens.process(img_list)
	res_mertens_8bit = np.clip(res_mertens*255, 0, 255).astype('uint8')
	cv.imwrite(rootFolder + "/" + outputName, res_mertens_8bit)

if __name__ == '__main__':
	main(sys.argv[1:])
